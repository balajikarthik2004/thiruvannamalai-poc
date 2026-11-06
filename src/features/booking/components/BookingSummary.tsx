import { useTranslation } from "react-i18next";
import { ClipboardList, CalendarDays, Lock, ShieldCheck, ArrowLeft, Smartphone, CreditCard, Landmark, Wallet, type LucideIcon, Flower2 } from "lucide-react";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import type { BookingCart } from "../constants";
import { computeBookingTotals, formatINR } from "../utils/totals";

const PAYMENT_METHODS: { id: string; label: string; hint: string; icon: LucideIcon }[] = [
  { id: "upi", label: "UPI (Google Pay, PhonePe, Paytm)", hint: "UPI", icon: Smartphone },
  { id: "card", label: "Debit / Credit Card", hint: "", icon: CreditCard },
  { id: "netbanking", label: "Net Banking", hint: "", icon: Landmark },
  { id: "wallet", label: "Wallet", hint: "", icon: Wallet },
];

interface Props {
  cart: BookingCart;
  details: { categoryId: string; persons: number };
  visitDate: Date | null;
  visitTime: string;
  onPay: (paymentMethod: string) => void;
  onBack: () => void;
  isProcessing: boolean;
  [k: string]: any;
}

export function BookingSummary({ cart, details, visitDate, visitTime, onPay, onBack, isProcessing }: Props) {
  const { t: tStr } = useTranslation();
  const { category, darshan, services, total } = computeBookingTotals(cart, details);
  const [method, setMethod] = useState("upi");
  const [loadingText, setLoadingText] = useState(() => tStr("Initiating secure connection..."));

  useEffect(() => {
    if (!isProcessing) return;
    const timers = [
      setTimeout(() => setLoadingText(tStr("Authenticating payment...")), 800),
      setTimeout(() => setLoadingText(tStr("Verifying with bank...")), 1800),
      setTimeout(() => setLoadingText(tStr("Confirming transaction...")), 2800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [isProcessing, tStr]);

  if (isProcessing) {
    return (
      <div className="bg-white border border-rose-100 rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center text-center min-h-[380px]">
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 rounded-full border-[6px] border-rose-100" />
          <div className="absolute inset-0 rounded-full border-[6px] border-saffron border-t-transparent animate-spin" />
          <Lock className="absolute inset-0 m-auto w-6 h-6 text-saffron" />
        </div>
        <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">{tStr("Processing Payment")}</h3>
        <p key={loadingText} className="text-sm text-slate-500 mb-6 animate-in fade-in">{loadingText}</p>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-rose-50 border border-rose-100 px-4 py-2 rounded-full">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> {tStr("100% Secure & Encrypted")}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Booking summary */}
        <section className="lg:col-span-3 bg-white border border-rose-100 rounded-3xl p-6 shadow-sm">
          <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2 mb-5">
            <ClipboardList className="w-5 h-5 text-saffron" /> {tStr("Comprehensive Booking Summary")}
          </h3>

          <div className="pb-5 border-b border-rose-100">
            <div className="flex items-center gap-2 font-bold text-slate-900 mb-3">
              <CalendarDays className="w-4 h-4 text-saffron" /> {tStr("Darshan Details")}
            </div>
            <dl className="space-y-2.5 text-sm">
              {[
                [tStr("Category"), category ? tStr(category.name) : "—"],
                [tStr("Date & Time"), `${visitDate ? format(visitDate, "d MMM yyyy") : "—"}${visitTime ? ` ${tStr("at")} ${visitTime}` : ""}`],
                [tStr("No. of Devotees"), String(details.persons || 1)],
                ...(darshan ? [[`${tStr("Darshan charge")} (${darshan.note})`, formatINR(darshan.amount)]] : []),
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-slate-500">{k}</dt>
                  <dd className="font-semibold text-slate-800 text-right">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="py-5">
            <div className="flex items-center gap-2 font-bold text-slate-900 mb-3">
              <Flower2 className="w-4 h-4 text-saffron" /> {tStr("Services")}
            </div>
            {services.length === 0 ? (
              <p className="text-sm text-slate-400">{tStr("No additional services selected.")}</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {services.map((l) => (
                  <li key={l.id} className="flex justify-between gap-3">
                    <span className="flex items-start gap-2 text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-saffron mt-1.5 shrink-0" />
                      <span>{tStr(l.label)}{l.note && <span className="text-slate-400 text-xs"> · {l.note}</span>}</span>
                    </span>
                    <span className="font-semibold text-slate-800 shrink-0">{formatINR(l.amount)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex justify-between items-center bg-rose-50 border border-rose-100 rounded-2xl px-5 py-4">
            <span className="font-bold text-slate-900 text-lg">{tStr("Total Payable")}</span>
            <span className="text-2xl font-black text-saffron tabular-nums">{formatINR(total)}</span>
          </div>
        </section>

        {/* Payment */}
        <section className="lg:col-span-2 bg-white border border-rose-100 rounded-3xl p-6 shadow-sm h-fit">
          <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2 mb-5">
            <CreditCard className="w-5 h-5 text-saffron" /> {tStr("Payment")}
          </h3>
          <div role="radiogroup" aria-label={tStr("Payment method")} className="space-y-3">
            {PAYMENT_METHODS.map((m) => {
              const selected = method === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setMethod(m.id)}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${selected ? "border-saffron bg-rose-50/60" : "border-slate-100 hover:border-saffron/40"}`}
                >
                  <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selected ? "border-saffron" : "border-slate-300"}`}>
                    {selected && <span className="w-2.5 h-2.5 rounded-full bg-saffron" />}
                  </span>
                  <span className="flex-1 text-sm font-semibold text-slate-800">{tStr(m.label)}</span>
                  <m.icon className={`w-5 h-5 ${selected ? "text-saffron" : "text-slate-400"}`} />
                </button>
              );
            })}
          </div>
          <p className="mt-5 flex items-center justify-center gap-1.5 text-xs font-medium text-emerald-700">
            <Lock className="w-3.5 h-3.5" /> {tStr("Your payment is secure and encrypted.")}
          </p>
        </section>
      </div>

      <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
        <button type="button" onClick={onBack} className="inline-flex items-center justify-center gap-2 bg-white border-2 border-rose-100 text-slate-700 font-bold px-7 py-3.5 rounded-full hover:border-saffron hover:text-saffron transition-colors">
          <ArrowLeft className="w-4 h-4" /> {tStr("Back to Select Services")}
        </button>
        <button type="button" onClick={() => onPay(method)} className="inline-flex items-center justify-center gap-2 bg-saffron text-white font-bold px-10 py-3.5 rounded-full shadow-lg shadow-saffron/25 hover:brightness-95 active:scale-[0.98] transition-all">
          <Lock className="w-4 h-4" /> {tStr("Pay")} {formatINR(total)} {tStr("Securely")}
        </button>
      </div>
    </div>
  );
}
