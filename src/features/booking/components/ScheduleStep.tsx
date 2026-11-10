import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Check,
  Info,
  ArrowRight,
  ArrowLeft,
  LayoutGrid,
} from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
} from "date-fns";
import {
  DARSHAN_CATEGORIES,
  DEFAULT_TIME_SLOTS,
  type DarshanCategory,
  type TimeSlotInfo,
} from "../constants";

interface Props {
  selectedCategory: DarshanCategory;
  onSelectCategory: (category: DarshanCategory) => void;
  selectedDate: Date;
  onSelectDate: (d: Date) => void;
  selectedTime: string;
  onSelectTime: (t: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function ScheduleStep({
  selectedCategory,
  onSelectCategory,
  selectedDate,
  onSelectDate,
  selectedTime,
  onSelectTime,
  onContinue,
  onBack,
}: Props) {
  const { t } = useTranslation();
  const [currentMonth, setCurrentMonth] = useState<Date>(selectedDate);

  // November 2026 dates from the reference image
  // 21 and 24 are festival/limited rush days
  const festivalDates = useMemo(() => ["2026-11-21", "2026-11-24"], []);

  // Calendar week rows
  const weeks = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    const rows: Date[][] = [];
    for (let d = start; d <= end; d = addDays(d, 7)) {
      rows.push(Array.from({ length: 7 }, (_, i) => addDays(d, i)));
    }
    return rows;
  }, [currentMonth]);

  // Formatted date string for the time slot subheader
  const dateFormatted = format(selectedDate, "d MMMM yyyy");

  return (
    <div className="rounded-2xl border border-[#E8E2D5] bg-white p-5 sm:p-7 shadow-xs">
      {/* Header */}
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FAF6F0] text-[#A86221]">
          <CalendarDays className="h-6 w-6 text-[#A86221]" />
        </div>
        <div>
          <h2 className="font-serif text-xl font-bold tracking-tight text-[#073C2C] sm:text-2xl">
            {t("Book Your Darshan")}
          </h2>
          <p className="mt-0.5 text-xs font-medium text-slate-500 sm:text-sm">
            {t("Choose darshan type, date and preferred time slot.")}
          </p>
        </div>
      </div>

      {/* 1. Darshan Category */}
      <div className="mb-8">
        <div className="mb-3.5 flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#073C2C] text-[11px] font-bold text-white">
            1
          </span>
          <h3 className="font-serif text-base font-bold text-[#073C2C]">
            {t("Darshan Category")}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {DARSHAN_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory.id === cat.id;
            const Icon = cat.icon;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`relative flex flex-col items-center justify-center rounded-xl p-3.5 text-center transition-all ${
                  isSelected
                    ? "border-2 border-[#16A34A] bg-[#F0FDF4] shadow-xs"
                    : "border border-slate-200 bg-white hover:border-[#16A34A]/50 hover:bg-slate-50/50"
                }`}
              >
                {/* Checkmark badge on selected card */}
                {isSelected && (
                  <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#16A34A] text-white shadow-xs">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </span>
                )}

                <div
                  className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full ${
                    isSelected ? "text-[#16A34A]" : "text-[#A86221]"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                <span
                  className={`text-xs sm:text-sm font-bold ${
                    isSelected ? "text-[#073C2C]" : "text-slate-800"
                  }`}
                >
                  {t(cat.name)}
                </span>
                <span
                  className={`mt-0.5 text-[11px] font-semibold ${
                    isSelected ? "text-[#16A34A]" : "text-slate-500"
                  }`}
                >
                  {cat.priceLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2 & 3: Calendar and Time Slot Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 2. Select Visit Date */}
        <div>
          <div className="mb-3.5 flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#073C2C] text-[11px] font-bold text-white">
              2
            </span>
            <h3 className="font-serif text-base font-bold text-[#073C2C]">
              {t("Select Visit Date")}
            </h3>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            {/* Month Navigation */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-700">
                <LayoutGrid className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-bold text-slate-800">
                  {format(currentMonth, "MMMM yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label={t("Previous month")}
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label={t("Next month")}
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Day of week headers */}
            <div className="mb-2 grid grid-cols-7 text-center text-[10px] font-bold text-slate-500 tracking-wider">
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
                <div key={d} className="py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Date Grid */}
            <div className="space-y-1">
              {weeks.map((week, wi) => (
                <div key={wi} className="grid grid-cols-7 gap-1 text-center">
                  {week.map((day, di) => {
                    const isCurMonth = isSameMonth(day, currentMonth);
                    const isSelected = isSameDay(day, selectedDate);
                    const ymd = format(day, "yyyy-MM-dd");
                    const isFestival = festivalDates.includes(ymd);

                    let dayStyle = "text-slate-800 hover:bg-slate-100";
                    if (!isCurMonth) {
                      dayStyle = "text-slate-300 pointer-events-none";
                    } else if (isSelected) {
                      dayStyle = "bg-[#073C2C] text-white font-bold shadow-xs hover:bg-[#073C2C]";
                    } else if (isFestival) {
                      dayStyle = "bg-[#FEF3C7] text-[#92400E] font-bold border border-[#FDE68A]";
                    }

                    return (
                      <button
                        key={di}
                        type="button"
                        disabled={!isCurMonth}
                        onClick={() => onSelectDate(day)}
                        className={`flex h-8 w-8 mx-auto items-center justify-center rounded-full text-xs font-semibold transition-all ${dayStyle}`}
                      >
                        {format(day, "d")}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Calendar Legend matching the image */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 border-t border-slate-100 pt-3 text-[11px] font-medium text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#16A34A]" />
                {t("Available")}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
                {t("Limited")}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#EF4444]" />
                {t("Full")}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#94A3B8]" />
                {t("Not Available")}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Choose Time Slot */}
        <div>
          <div className="mb-3.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#073C2C] text-[11px] font-bold text-white">
                3
              </span>
              <div>
                <h3 className="font-serif text-base font-bold text-[#073C2C]">
                  {t("Choose Time Slot")}
                </h3>
              </div>
            </div>
          </div>

          <p className="mb-3 text-xs font-medium text-slate-500">
            {t("For")} {dateFormatted} ({t(selectedCategory.name)})
          </p>

          {/* Time Slots Grid (3 columns x 4 rows) */}
          <div className="grid grid-cols-3 gap-2.5">
            {DEFAULT_TIME_SLOTS.map((slot: TimeSlotInfo) => {
              const isSelected = selectedTime === slot.time;
              const isFull = slot.status === "full";

              let slotStyle = "bg-white border-slate-200 text-slate-800 hover:border-[#16A34A]";
              let tagStyle = "text-[#16A34A]";

              if (isFull) {
                slotStyle = "bg-[#FEF2F2] border-[#FECACA] text-slate-400 cursor-not-allowed";
                tagStyle = "text-[#DC2626]";
              } else if (slot.status === "limited") {
                slotStyle = "bg-[#FFFBEB] border-[#FDE68A] text-slate-800 hover:border-[#D97706]";
                tagStyle = "text-[#D97706]";
              }

              if (isSelected) {
                slotStyle = "bg-[#F0FDF4] border-2 border-[#16A34A] text-[#073C2C] font-bold shadow-xs";
                tagStyle = "text-[#16A34A]";
              }

              return (
                <button
                  key={slot.time}
                  type="button"
                  disabled={isFull}
                  onClick={() => onSelectTime(slot.time)}
                  className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all ${slotStyle}`}
                >
                  <span className="text-xs font-bold leading-tight">
                    {slot.time}
                  </span>
                  <span className={`mt-0.5 text-[10px] font-semibold leading-tight ${tagStyle}`}>
                    {slot.status === "available"
                      ? t("Available")
                      : slot.status === "limited"
                      ? `${t("Limited")} (${slot.left} ${t("left")})`
                      : t("Full")}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Reporting Time Notice */}
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#DCFCE7] bg-[#F0FDF4] px-3.5 py-2.5 text-xs font-semibold text-[#166534]">
            <Info className="h-4 w-4 shrink-0 text-[#16A34A]" />
            <span>
              {t("Reporting Time : 15 minutes before your selected slot")}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t("Back")}
        </button>

        <button
          type="button"
          onClick={onContinue}
          className="inline-flex items-center gap-2 rounded-xl bg-[#073C2C] px-6 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#06432A] hover:shadow-md"
        >
          {t("Continue to Devotee Details")}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

