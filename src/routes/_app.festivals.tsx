import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CalendarDays, Star, MapPin, Ticket, Search, Sparkles } from "lucide-react";

import { templeEvents, type TempleEvent } from "@/data/events";
import { temples } from "@/data/temples";
import { nextFullMoon, nextKarthigaiDeepam, formatFestivalDate, daysUntil } from "@/lib/lunar";

export const Route = createFileRoute("/_app/festivals")({
  head: () => ({
    meta: [
      { title: "Festival Calendar — OMG Devotee" },
      {
        name: "description",
        content: "Upcoming temple festivals, Brahmotsavam dates and Girivalam full-moon days across every temple on OMG Devotee.",
      },
    ],
  }),
  component: FestivalCalendar,
});

interface DatedEvent extends TempleEvent {
  templeSlug: string;
  templeName: string;
  /** Sort key — only set when the event carries an exact bookDate. */
  sortDate: number;
}

const templeName = (slug: string) =>
  temples.find((x) => x.slug === slug)?.name ?? slug;

function FestivalCalendar() {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const [slug, setSlug] = useState("all");
  const [majorOnly, setMajorOnly] = useState(false);

  const now = new Date();
  const pournami = useMemo(() => nextFullMoon(now), [now.getDate()]); // eslint-disable-line react-hooks/exhaustive-deps
  const deepam = useMemo(() => nextKarthigaiDeepam(now), [now.getDate()]); // eslint-disable-line react-hooks/exhaustive-deps

  /** Every temple's events, flattened and ordered by known date first. */
  const all = useMemo<DatedEvent[]>(() => {
    const out: DatedEvent[] = [];
    for (const [templeSlug, events] of Object.entries(templeEvents)) {
      for (const e of events) {
        out.push({
          ...e,
          templeSlug,
          templeName: templeName(templeSlug),
          sortDate: e.bookDate ? new Date(e.bookDate).getTime() : Number.MAX_SAFE_INTEGER,
        });
      }
    }
    return out.sort((a, b) => a.sortDate - b.sortDate);
  }, []);

  const slugs = useMemo(() => Object.keys(templeEvents), []);

  const shown = useMemo(() => {
    const v = q.trim().toLowerCase();
    return all.filter((e) => {
      if (slug !== "all" && e.templeSlug !== slug) return false;
      if (majorOnly && !e.isMajor) return false;
      if (!v) return true;
      return [e.title, e.description, e.templeName].some((f) => f.toLowerCase().includes(v));
    });
  }, [all, q, slug, majorOnly]);

  return (
    <div className="min-h-screen gv-surface pb-10">
      <header className="border-b border-[#E9E2D8] px-4 pb-7 pt-7 lg:px-7">
        <div className="mx-auto max-w-[1540px]">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#e0cf9a] bg-[#fdf6e3] px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-[#b8860b]">
            <CalendarDays className="h-4 w-4" /> {t("Festival Calendar")}
          </span>
          <h1 className="mt-3 font-serif text-3xl font-bold text-[#003D2E]">
            {t("Upcoming festivals & observances")}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-[#77736C]">
            {t("Brahmotsavam dates, Deepam, Girivalam full moons and monthly observances across every temple.")}
          </p>

          {/* The two dates every Arunachala devotee plans around */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:max-w-2xl">
            <HighlightCard
              icon={Sparkles}
              label={t("Next Pournami Girivalam")}
              value={formatFestivalDate(pournami)}
              sub={`${daysUntil(pournami, now)} ${t("days away")}`}
            />
            <HighlightCard
              icon={Star}
              label={t("Karthigai Maha Deepam")}
              value={formatFestivalDate(deepam)}
              sub={`${daysUntil(deepam, now)} ${t("days away")}`}
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <label className="relative block min-w-[240px] flex-1 sm:max-w-sm">
              <span className="sr-only">{t("Search festivals")}</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("Search festivals…")}
                className="h-11 w-full rounded-full border border-[#E9E2D8] bg-white pl-11 pr-4 text-sm shadow-sm outline-none focus:border-[#D99A32] focus:ring-4 focus:ring-[#D99A32]/15"
              />
            </label>
            <button
              type="button"
              onClick={() => setMajorOnly((v) => !v)}
              aria-pressed={majorOnly}
              className={`h-11 shrink-0 rounded-full border px-4 text-sm font-semibold transition-all ${
                majorOnly
                  ? "border-[#D99A32] bg-[#D99A32] text-[#202124] shadow-md"
                  : "border-[#E9E2D8] bg-white text-[#77736C] hover:border-[#D99A32]/60"
              }`}
            >
              <Star className="mr-1.5 inline h-3.5 w-3.5" />
              {t("Major festivals only")}
            </button>
          </div>

          <div role="tablist" aria-label={t("Temple")} className="scrollbar-hide mt-3 flex gap-2 overflow-x-auto pb-1">
            {["all", ...slugs].map((s) => {
              const active = slug === s;
              const count =
                s === "all" ? all.length : all.filter((e) => e.templeSlug === s).length;
              return (
                <button
                  key={s}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSlug(s)}
                  className={`h-9 shrink-0 rounded-full border px-4 text-sm font-semibold transition-all ${
                    active
                      ? "border-[#003D2E] bg-[#003D2E] text-white shadow-md"
                      : "border-[#E9E2D8] bg-white text-[#77736C] hover:border-[#D99A32]/60 hover:text-[#003D2E]"
                  }`}
                >
                  {s === "all" ? t("All temples") : t(templeName(s).replace(/\s+Temple$/i, ""))} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1540px] px-4 pt-5 lg:px-7">
        {shown.length > 0 ? (
          <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {shown.map((e, i) => (
              <li key={`${e.templeSlug}-${e.title}-${i}`}>
                <EventCard event={e} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="gv-card py-16 text-center">
            <h3 className="mb-1 text-lg font-bold text-[#202124]">{t("No festivals found")}</h3>
            <p className="text-sm text-[#77736C]">{t("Try adjusting your search term.")}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function HighlightCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof Star;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e0cf9a] bg-gradient-to-br from-[#fdf6e3] to-[#f6ead0] p-4">
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#b8860b]">
        <Icon className="h-4 w-4" /> {label}
      </div>
      <div className="mt-1 font-serif text-base font-bold text-[#003D2E]">{value}</div>
      <div className="text-xs text-[#77736C]">{sub}</div>
    </div>
  );
}

function EventCard({ event }: { event: DatedEvent }) {
  const { t } = useTranslation();
  const bookable = !!event.bookDate;

  return (
    <article className="gv-card flex h-full flex-col p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-serif text-[15px] font-bold leading-snug text-[#202124]">
          {t(event.title)}
        </h3>
        {event.isMajor && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#D99A32]/15 px-2 py-0.5 text-[10px] font-bold text-[#8a6410]">
            <Star className="h-3 w-3" /> {t("Major")}
          </span>
        )}
      </div>

      <div className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#003D2E]">
        <CalendarDays className="h-3.5 w-3.5 shrink-0 text-[#D99A32]" />
        {t(event.date)}
      </div>

      <Link
        to="/temple/$slug"
        params={{ slug: event.templeSlug }}
        className="mt-1 flex items-center gap-1.5 text-xs text-[#77736C] transition-colors hover:text-[#003D2E]"
      >
        <MapPin className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">{t(event.templeName)}</span>
      </Link>

      <p className="mt-2.5 flex-1 text-xs leading-relaxed text-[#77736C]">{t(event.description)}</p>

      {bookable && (
        <Link
          to="/booking/$slug"
          params={{ slug: event.templeSlug }}
          className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#003D2E] px-4 py-2 text-xs font-bold text-white transition-all hover:brightness-125"
        >
          <Ticket className="h-3.5 w-3.5" /> {t("Book darshan")}
        </Link>
      )}
    </article>
  );
}
