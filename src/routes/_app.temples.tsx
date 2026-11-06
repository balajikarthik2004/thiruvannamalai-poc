import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Compass, Search, MapPin, Users, Clock, ArrowRight } from "lucide-react";

import { temples, templeThumb, statusLabel, type Temple } from "@/data/temples";
import { SEVERITY_BANDS, severityFor } from "@/data/operations";
import { formatCount } from "@/lib/currency";

export const Route = createFileRoute("/_app/temples")({
  head: () => ({
    meta: [
      { title: "Explore Temples — OMG Devotee" },
      { name: "description", content: "Browse every temple on the OMG Devotee platform with live crowd and timing information." },
    ],
  }),
  component: ExploreTemples,
});

function ExploreTemples() {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const [state, setState] = useState("All");

  const states = useMemo(
    () => ["All", ...Array.from(new Set(temples.map((x) => x.state)))],
    []
  );

  const results = useMemo(() => {
    const v = q.trim().toLowerCase();
    return temples.filter((x) => {
      if (state !== "All" && x.state !== state) return false;
      if (!v) return true;
      return [x.name, x.city, x.district, x.deity].some((f) => f.toLowerCase().includes(v));
    });
  }, [q, state]);

  return (
    <div className="min-h-screen gv-surface pb-10">
      <header className="border-b border-[#e9e2d2] px-4 pb-7 pt-7 lg:px-7">
        <div className="mx-auto max-w-[1540px]">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#e0cf9a] bg-[#fdf6e3] px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-[#b8860b]">
            <Compass className="h-4 w-4" /> {t("Explore Temples")}
          </span>
          <h1 className="mt-3 font-serif text-3xl font-bold text-[#14532d]">
            {t("Temples on OMG Devotee")}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-600">
            {t("Live crowd, timings and darshan guidance for every temple on the platform.")}
          </p>

          <label className="relative mt-5 block max-w-md">
            <span className="sr-only">{t("Search temples")}</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("Search by temple, deity or district…")}
              className="h-12 w-full rounded-full border border-[#e4ddcc] bg-white pl-11 pr-4 text-sm shadow-sm outline-none focus:border-[#c9a227] focus:ring-4 focus:ring-[#c9a227]/15"
            />
          </label>

          <div role="tablist" aria-label={t("State")} className="scrollbar-hide mt-4 flex gap-2 overflow-x-auto pb-1">
            {states.map((s) => {
              const active = state === s;
              const count = s === "All" ? temples.length : temples.filter((x) => x.state === s).length;
              return (
                <button
                  key={s}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setState(s)}
                  className={`h-9 shrink-0 rounded-full border px-4 text-sm font-semibold transition-all ${
                    active
                      ? "border-[#14532d] bg-[#14532d] text-white shadow-md"
                      : "border-[#e4ddcc] bg-white text-slate-600 hover:border-[#c9a227]/60 hover:text-[#14532d]"
                  }`}
                >
                  {s === "All" ? t("All States") : t(s)} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1540px] px-4 pt-5 lg:px-7">
        {results.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((temple) => (
              <TempleTile key={temple.id} temple={temple} />
            ))}
          </div>
        ) : (
          <div className="gv-card py-16 text-center">
            <h3 className="mb-1 text-lg font-bold text-slate-900">{t("No temples found")}</h3>
            <p className="text-sm text-slate-500">{t("Try adjusting your search term.")}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TempleTile({ temple }: { temple: Temple }) {
  const { t } = useTranslation();
  const band = SEVERITY_BANDS.find((b) => b.key === severityFor(temple.crowdPct))!;

  return (
    <Link
      to="/temple/$slug"
      params={{ slug: temple.slug }}
      className="group gv-card flex h-full flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div
        className="relative aspect-[16/10] w-full"
        style={{ background: templeThumb(temple, "center 32%") }}
        role="img"
        aria-label={t(temple.name)}
      >
        <span
          className={`absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${band.bg} ${band.text} ${band.border}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${band.dot}`} />
          {t(statusLabel(temple.crowdStatus))}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-serif text-[15px] font-bold leading-snug text-slate-900 transition-colors group-hover:text-[#14532d]">
          {t(temple.name)}
        </h3>
        <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#b8860b]" />
          <span className="truncate">
            {t(temple.city)}, {t(temple.state)}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] font-semibold text-slate-600">
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-[#217a4f]" /> {formatCount(temple.crowd)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-[#217a4f]" /> {temple.waitMin} {t("min")}
          </span>
        </div>
        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-[#217a4f]">
          {t("View details")}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
