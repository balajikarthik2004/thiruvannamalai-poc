import { useTranslation } from "react-i18next";
import { Clock, AlertCircle, ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, isBefore, isAfter } from "date-fns";

interface Props {
  t: any;
  selectedDate: Date | null;
  setSelectedDate: (d: Date) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  /** Days flagged as "High rush" (YYYY-MM-DD), e.g. festival dates. */
  highRushDates?: string[];
  /** Rendered beside the legend, e.g. the Continue button. */
  action?: ReactNode;
}

export function DateTimeSelector({ t, selectedDate, setSelectedDate, selectedTime, setSelectedTime, highRushDates = [], action }: Props) {
  const { t: tStr } = useTranslation();
  const [currentMonth, setCurrentMonth] = useState(selectedDate ?? new Date());

  // When a date is chosen from outside (e.g. an upcoming event), show that month.
  useEffect(() => {
    if (selectedDate && !isSameMonth(selectedDate, currentMonth)) setCurrentMonth(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = addDays(today, 90);
  const rushSet = useMemo(() => new Set(highRushDates), [highRushDates]);

  const availableTimes = useMemo(() => {
    if (!selectedDate) return [];
    const toMins = (v: string | undefined) => {
      if (!v) return -1;
      const [h, m] = v.split(":").map(Number);
      return h * 60 + m;
    };
    const openMins = toMins(t.openTime);
    const closeMins = toMins(t.closeTime);
    const acMins = toMins(t.afternoonClose);
    const aoMins = toMins(t.afternoonOpen);
    const minTimeMs = Date.now() + 24 * 60 * 60 * 1000;

    const slots: string[] = [];
    for (let h = Math.ceil(openMins / 60); h < Math.ceil(closeMins / 60); h++) {
      const slotMins = h * 60;
      if (slotMins >= closeMins) continue;
      if (acMins !== -1 && aoMins !== -1 && slotMins >= acMins && slotMins < aoMins) continue;
      const slotDate = new Date(selectedDate);
      slotDate.setHours(h, 0, 0, 0);
      if (slotDate.getTime() >= minTimeMs) {
        const hr12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
        slots.push(`${hr12}:00 ${h >= 12 ? tStr("PM") : tStr("AM")}`);
      }
    }
    return slots;
  }, [selectedDate, t, tStr]);

  const weeks = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    const rows: Date[][] = [];
    for (let d = start; d <= end; d = addDays(d, 7)) {
      rows.push(Array.from({ length: 7 }, (_, i) => addDays(d, i)));
    }
    return rows;
  }, [currentMonth]);

  const canGoPrev = isAfter(startOfMonth(currentMonth), today);
  const canGoNext = isBefore(endOfMonth(currentMonth), maxDate);

  return (
    <div className="w-full">
      <div className="bg-amber-50 border border-amber-200/70 rounded-2xl px-4 py-3 flex items-start gap-3 mb-6">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
        <p className="text-amber-900 text-sm">
          <span className="font-bold">{tStr("Advance Booking Required:")}</span>{" "}
          {tStr("Please select a date at least 24 hours in advance to guarantee your booking.")}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Calendar */}
        <div className="border border-rose-100 rounded-2xl p-4 sm:p-5 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-saffron" />
              <h4 className="font-bold text-lg text-slate-900">{format(currentMonth, "MMMM yyyy")}</h4>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label={tStr("Previous month")}
                disabled={!canGoPrev}
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:border-saffron hover:text-saffron transition disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label={tStr("Next month")}
                disabled={!canGoNext}
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:border-saffron hover:text-saffron transition disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 mb-1">
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
              <div key={d} className="text-center text-[11px] font-bold text-slate-500 py-2">{tStr(d)}</div>
            ))}
          </div>

          <div className="space-y-1">
            {weeks.map((week) => (
              <div key={week[0].toISOString()} className="grid grid-cols-7">
                {week.map((day) => {
                  const inMonth = isSameMonth(day, currentMonth);
                  const isSelected = !!selectedDate && isSameDay(day, selectedDate);
                  const isDisabled = !inMonth || isBefore(day, addDays(today, 1)) || isAfter(day, maxDate);
                  const isRush = inMonth && rushSet.has(format(day, "yyyy-MM-dd"));
                  return (
                    <div key={day.toISOString()} className="flex items-center justify-center py-0.5">
                      <button
                        type="button"
                        disabled={isDisabled}
                        aria-pressed={isSelected}
                        aria-label={format(day, "d MMMM yyyy") + (isRush ? ` · ${tStr("High rush")}` : "")}
                        onClick={() => { setSelectedDate(new Date(day)); setSelectedTime(""); }}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full text-sm font-semibold transition-all ${
                          isSelected
                            ? "bg-saffron text-white shadow-md shadow-saffron/30"
                            : !inMonth
                            ? "text-slate-300 cursor-default"
                            : isDisabled
                            ? "text-slate-300 cursor-not-allowed"
                            : isRush
                            ? "bg-rose-100 text-saffron hover:bg-rose-200"
                            : "text-slate-800 hover:bg-rose-50 hover:text-saffron"
                        }`}
                      >
                        {format(day, "d")}
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Time slots */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full border-2 border-rose-100 flex items-center justify-center text-saffron shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-slate-900 leading-tight">{tStr("Select Arrival Time")}</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedDate ? <>{tStr("For Date:")} {format(selectedDate, "do MMMM yyyy")}</> : tStr("Pick a date on the calendar first")}
              </p>
            </div>
          </div>

          {!selectedDate ? (
            <div className="grid grid-cols-3 gap-3" aria-hidden>
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-11 rounded-full border border-dashed border-slate-200 bg-slate-50/60" />
              ))}
            </div>
          ) : availableTimes.length === 0 ? (
            <div className="text-sm text-rose-700 bg-rose-50 p-4 rounded-2xl border border-rose-100 flex gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {tStr("No slots available for this date that meet the 24-hour advance requirement.")}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {availableTimes.map((time) => (
                <button
                  key={time}
                  type="button"
                  aria-pressed={selectedTime === time}
                  onClick={() => setSelectedTime(time)}
                  className={`h-11 rounded-full text-sm font-semibold border transition-all ${
                    selectedTime === time
                      ? "bg-saffron text-white border-saffron shadow-md shadow-saffron/25"
                      : "bg-white border-slate-200 text-slate-700 hover:border-saffron hover:text-saffron"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Legend + action */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-600">
          <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-full bg-saffron" />{tStr("Selected date")}</span>
          <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-full bg-rose-100" />{tStr("High rush")}</span>
          <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-full bg-slate-200" />{tStr("Not available")}</span>
        </div>
        {action}
      </div>
    </div>
  );
}
