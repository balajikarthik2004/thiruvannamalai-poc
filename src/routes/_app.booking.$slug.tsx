import { createFileRoute, notFound } from "@tanstack/react-router";
import { getTemple } from "@/data/temples";
import { useMemo, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { BookingHeader } from "@/features/booking/components/BookingHeader";
import { DateTimeSelector } from "@/features/booking/components/DateTimeSelector";
import { ServiceSelection } from "@/features/booking/components/ServiceSelection";
import { BookingForm } from "@/features/booking/components/BookingForm";
import { BookingSummary } from "@/features/booking/components/BookingSummary";
import { BookingSuccess } from "@/features/booking/components/BookingSuccess";
import { BookingCartSummary } from "@/features/booking/components/BookingCartSummary";
import { UpcomingEvents, parseBookDate } from "@/features/booking/components/UpcomingEvents";
import { Check, CalendarCheck, X, ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";
import { getUpcomingEvents, type TempleEvent } from "@/data/events";
import type { BookingCart } from "@/features/booking/constants";

export const Route = createFileRoute("/_app/booking/$slug")({
  loader: ({ params }) => {
    const t = getTemple(params.slug);
    if (!t) throw notFound();
    return { temple: t };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `Comprehensive Booking — ${loaderData?.temple.name}` }],
  }),
  component: BookingPage,
});

export { DARSHAN_CATEGORIES } from "@/features/booking/constants";
export type { BookingCart } from "@/features/booking/constants";

const STEPS = ["Schedule", "Devotee Details", "Select Services", "Checkout"] as const;
type Step = 1 | 2 | 3 | 4 | "processing" | "success";

function PrimaryButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center justify-center gap-2 bg-saffron text-white font-bold px-8 py-3.5 rounded-full shadow-lg shadow-saffron/25 hover:brightness-95 active:scale-[0.98] transition-all">
      {children} <ArrowRight className="w-4 h-4" />
    </button>
  );
}

function SecondaryButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center justify-center gap-2 bg-white border-2 border-rose-100 text-slate-700 font-bold px-7 py-3.5 rounded-full hover:border-saffron hover:text-saffron transition-colors">
      <ArrowLeft className="w-4 h-4" /> {children}
    </button>
  );
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`bg-[#fffdfc] border border-rose-100 rounded-3xl p-5 sm:p-7 shadow-sm ${className}`}>{children}</div>;
}

function BookingPage() {
  const { temple: t } = Route.useLoaderData();
  const { t: tStr } = useTranslation();

  const [cart, setCart] = useState<BookingCart>({
    darshan: { type: "", persons: 1, price: 0, date: null, time: "" },
    poojas: [],
    prasadam: [],
    archana: { optIn: false, partnerDelivery: false, price: 0 },
    accommodations: { type: "", nights: 1, price: 0, checkIn: null },
    venues: { type: "", price: 0, date: null },
    donations: { amount: 0, frequency: "one-time", cause: "general", pledgeDate: "" },
  });

  const [visitDate, setVisitDate] = useState<Date | null>(null);
  const [visitTime, setVisitTime] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<TempleEvent | null>(null);
  const [details, setDetails] = useState({ name: "", phone: "", idNumber: "", categoryId: "special", persons: 1 });
  const [errors, setErrors] = useState<any>({});
  const [step, setStep] = useState<Step>(1);

  // Festival days with an exact date are shown as "High rush" on the calendar.
  const highRushDates = useMemo(
    () => getUpcomingEvents(t.slug).map((e) => e.bookDate).filter((d): d is string => !!d),
    [t.slug],
  );

  const goTo = (next: Step) => {
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Clicking an upcoming event pre-selects its date and takes the devotee to the Schedule
  // step to choose a time; the Darshan category is chosen on the next (Devotee Details) step.
  const handleSelectEvent = (event: TempleEvent) => {
    if (!event.bookDate) return;
    setSelectedEvent(event);
    setVisitDate(parseBookDate(event.bookDate));
    setVisitTime("");
    setErrors({});
    goTo(1);
  };

  const handleProceedToDevotee = () => {
    if (!visitDate || !visitTime) {
      setErrors({ date: tStr("Please select a date and time for your visit.") });
      return;
    }
    setErrors({});
    goTo(2);
  };

  const handleProceedToServices = () => {
    const errs: any = {};
    if (!details.name.trim()) errs.name = tStr("Name is required");
    if (details.phone.length < 10) errs.phone = tStr("Valid phone required");
    if (details.idNumber.length < 4) errs.idNumber = tStr("Valid ID required");
    setErrors(errs);
    if (Object.keys(errs).length === 0) goTo(3);
  };

  const handlePay = (_paymentMethod: string) => {
    setStep("processing");
    setTimeout(() => goTo("success"), 3500);
  };

  const currentStep = typeof step === "number" ? step : 4;
  const showEvents = step === 1 || step === 2;

  return (
    <div className="pb-32 lg:pb-10 min-h-screen bg-[#fdf8f6]">
      <BookingHeader t={t} />

      {/* Four-step progress tracker */}
      {step !== "success" && (
        <nav aria-label={tStr("Booking progress")} className="max-w-3xl mx-auto px-4 mt-8 mb-8">
          <ol className="flex items-start">
            {STEPS.map((label, i) => {
              const num = i + 1;
              const done = currentStep > num;
              const active = currentStep === num;
              return (
                <li key={label} className="flex-1 flex flex-col items-center relative" aria-current={active ? "step" : undefined}>
                  {i > 0 && (
                    <span aria-hidden className={`absolute top-5 right-1/2 w-full h-0.5 -translate-y-1/2 ${currentStep >= num ? "bg-saffron" : "bg-rose-100"}`} />
                  )}
                  <span
                    className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      done
                        ? "bg-saffron text-white shadow-md shadow-saffron/30"
                        : active
                        ? "bg-white text-saffron border-2 border-saffron ring-4 ring-saffron/10"
                        : "bg-white text-slate-400 border-2 border-slate-200"
                    }`}
                  >
                    {done ? <Check className="w-5 h-5" /> : num}
                  </span>
                  <span className={`mt-2 text-[11px] sm:text-xs text-center font-semibold ${active ? "text-saffron" : done ? "text-slate-800" : "text-slate-400"}`}>
                    {tStr(label)}
                  </span>
                </li>
              );
            })}
          </ol>
        </nav>
      )}

      <div className="max-w-[1400px] w-full mx-auto px-4 xl:px-8">
        {step === "success" ? (
          <div className="pt-8">
            <BookingSuccess t={t} details={details} cart={cart} visitDate={visitDate} visitTime={visitTime} />
          </div>
        ) : step === 4 || step === "processing" ? (
          <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
            <BookingSummary
              cart={cart}
              details={details}
              visitDate={visitDate}
              visitTime={visitTime}
              onPay={handlePay}
              onBack={() => goTo(3)}
              isProcessing={step === "processing"}
            />
          </div>
        ) : (
          <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px] gap-6 items-stretch">
            <div className="min-w-0">
              {/* STEP 1: SCHEDULE */}
              {step === 1 && (
                <div className="animate-in fade-in duration-500">
                  {selectedEvent && (
                    <div className="mb-4 flex items-start justify-between gap-3 bg-rose-50 border border-rose-100 rounded-2xl p-4">
                      <div className="flex items-start gap-3">
                        <CalendarCheck className="w-5 h-5 text-saffron shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm font-bold text-slate-800">{tStr("Booking for")} {tStr(selectedEvent.title)}</div>
                          <div className="text-xs text-slate-600 mt-0.5">{tStr(selectedEvent.date)} · {tStr("Pick a time slot below, then choose your Darshan category.")}</div>
                        </div>
                      </div>
                      <button type="button" onClick={() => setSelectedEvent(null)} aria-label={tStr("Clear event")} className="text-slate-400 hover:text-slate-700 shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <Card>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-saffron shrink-0">
                        <CalendarDays className="w-5 h-5" />
                      </div>
                      <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">{tStr("When are you visiting?")}</h2>
                    </div>
                    {errors.date && (
                      <div role="alert" className="mb-4 bg-rose-50 text-rose-700 p-3 rounded-xl border border-rose-200 font-semibold text-sm">{errors.date}</div>
                    )}
                    <DateTimeSelector
                      t={t}
                      selectedDate={visitDate}
                      setSelectedDate={(d: Date) => {
                        setVisitDate(d);
                        setErrors((e: any) => ({ ...e, date: null }));
                        if (selectedEvent?.bookDate && parseBookDate(selectedEvent.bookDate).getTime() !== d.getTime()) setSelectedEvent(null);
                      }}
                      selectedTime={visitTime}
                      setSelectedTime={(time: string) => {
                        setVisitTime(time);
                        setErrors((e: any) => ({ ...e, date: null }));
                      }}
                      highRushDates={highRushDates}
                      action={<PrimaryButton onClick={handleProceedToDevotee}>{tStr("Continue to Devotee Details")}</PrimaryButton>}
                    />
                  </Card>
                </div>
              )}

              {/* STEP 2: DEVOTEE DETAILS */}
              {step === 2 && (
                <Card className="animate-in fade-in duration-500">
                  <BookingForm details={details} setDetails={setDetails} errors={errors} />
                  <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 mt-8 pt-6 border-t border-rose-100">
                    <SecondaryButton onClick={() => goTo(1)}>{tStr("Back to Schedule")}</SecondaryButton>
                    <PrimaryButton onClick={handleProceedToServices}>{tStr("Continue to Select Services")}</PrimaryButton>
                  </div>
                </Card>
              )}

              {/* STEP 3: SELECT SERVICES */}
              {step === 3 && (
                <div className="animate-in fade-in duration-500">
                  <Card>
                    <ServiceSelection cart={cart} setCart={setCart} />
                  </Card>
                  <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 mt-6">
                    <SecondaryButton onClick={() => goTo(2)}>{tStr("Back to Devotee Details")}</SecondaryButton>
                    <PrimaryButton onClick={() => goTo(4)}>{tStr("Continue to Checkout")}</PrimaryButton>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar: events (steps 1–2) or live booking summary (step 3). Sticky, and the events list scrolls on its own. */}
            <aside className="relative min-w-0">
              {showEvents ? (
                // Absolutely filled on desktop so the events card matches the main card's height
                // exactly (it never stretches the row) and scrolls inside itself.
                <div className="lg:absolute lg:inset-0">
                  <UpcomingEvents slug={t.slug} onSelectEvent={handleSelectEvent} selectedTitle={selectedEvent?.title} />
                </div>
              ) : (
                <div className="lg:sticky lg:top-6">
                  <BookingCartSummary cart={cart} details={details} visitDate={visitDate} visitTime={visitTime} />
                </div>
              )}
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
