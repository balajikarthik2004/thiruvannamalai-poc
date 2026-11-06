import { useTranslation } from "react-i18next";
import { CalendarDays, ArrowRight, Flame } from "lucide-react";
import { getUpcomingEvents, type TempleEvent } from "@/data/events";

const BOOKING_WINDOW_DAYS = 90;

/** Parses "YYYY-MM-DD" as a local date (not UTC) so the calendar shows the right day. */
export function parseBookDate(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Bookable = exact date known and it falls inside the booking calendar's window (tomorrow … +90 days). */
function isBookable(event: TempleEvent): boolean {
  if (!event.bookDate) return false;
  const day = parseBookDate(event.bookDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const min = new Date(today);
  min.setDate(today.getDate() + 1);
  const max = new Date(today);
  max.setDate(today.getDate() + BOOKING_WINDOW_DAYS);
  return day >= min && day <= max;
}

export function UpcomingEvents({
  slug,
  onSelectEvent,
  selectedTitle,
}: {
  slug: string;
  onSelectEvent?: (event: TempleEvent) => void;
  selectedTitle?: string;
}) {
  const { t: tStr } = useTranslation();
  const events = getUpcomingEvents(slug);

  if (events.length === 0) return null;

  return (
    // Self-contained scroll area: the card is capped to the viewport and only the list scrolls,
    // so a long festival calendar never pushes into or overlaps the booking steps.
    <div className="bg-white border border-rose-100 rounded-3xl shadow-sm flex flex-col max-h-[480px] lg:max-h-none lg:h-full overflow-hidden">
      <div className="px-5 pt-5 pb-3 border-b border-rose-100 shrink-0">
        <h3 className="font-serif text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-saffron" />
          {tStr("Upcoming Temple Events")}
        </h3>
        {onSelectEvent && (
          <p className="text-[11px] text-slate-500">{tStr("Tap an event to book darshan for that day.")}</p>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 py-4">
        <div className="space-y-3">
          {events.map((event, i) => {
            const bookable = !!onSelectEvent && isBookable(event);
            const isSelected = bookable && selectedTitle === event.title;
            const base = `block w-full text-left p-4 rounded-2xl border transition-all ${
              event.isMajor ? "bg-rose-50/50 border-rose-100" : "bg-white border-slate-100"
            }`;
            const interactive = bookable
              ? "cursor-pointer hover:shadow-md hover:border-saffron/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
              : "";
            const selected = isSelected ? "ring-2 ring-saffron border-saffron/60" : "";

            const body = (
              <>
                <div className="mb-2">
                  <div className="font-bold text-slate-800 text-sm flex items-center gap-1.5 mb-2">
                    {tStr(event.title)}
                    {event.isMajor && <Flame className="w-3.5 h-3.5 text-saffron shrink-0" />}
                  </div>
                  <div className="inline-block text-[10px] font-bold uppercase tracking-widest text-saffron bg-white border border-rose-100 px-2 py-0.5 rounded-full shadow-sm">
                    {tStr(event.date)}
                  </div>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {tStr(event.description)}
                </p>
                {bookable && (
                  <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-saffron">
                    {isSelected ? tStr("Selected for your booking") : tStr("Book darshan for this day")}
                    {!isSelected && <ArrowRight className="w-3.5 h-3.5" />}
                  </div>
                )}
              </>
            );

            return bookable ? (
              <button
                key={i}
                type="button"
                onClick={() => onSelectEvent!(event)}
                aria-pressed={isSelected}
                className={`${base} ${interactive} ${selected}`}
              >
                {body}
              </button>
            ) : (
              <div key={i} className={base}>{body}</div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
