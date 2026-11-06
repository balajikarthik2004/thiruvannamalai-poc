import { useTranslation } from "react-i18next";
import { ClipboardList, ShieldCheck, Lock, Loader2, Receipt, CalendarClock } from "lucide-react";
import type { Temple } from "@/data/temples";
import { CAUSES, PAYMENT_METHODS, frequencyGroup, frequencyLabel } from "../constants";

interface Props {
  templeObj: Temple;
  cause: string;
  frequency: string;
  pledgeDate: string;
  amount: number;
  paymentMethod: string;
  setPaymentMethod: (m: string) => void;
  isProcessing: boolean;
  canSubmit: boolean;
  onPay: () => void;
}

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export function DonationSummary({ templeObj, cause, frequency, pledgeDate, amount, paymentMethod, setPaymentMethod, isProcessing, canSubmit, onPay }: Props) {
  const { t: tStr } = useTranslation();
  const group = frequencyGroup(frequency);
  const isPledge = group === "pledge";
  const causeTitle = CAUSES.find((c) => c.id === cause)?.title ?? "";

  const rows: [string, string][] = [
    [tStr("Temple"), tStr(templeObj.name)],
    [tStr("Cause"), tStr(causeTitle)],
    [tStr("Frequency"), tStr(frequencyLabel(frequency))],
    ...(isPledge && pledgeDate ? [[tStr("Pledge by"), new Date(pledgeDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })] as [string, string]] : []),
  ];

  const cta = isPledge
    ? `${tStr("Confirm Pledge of")} ${fmt(amount)}`
    : group === "recurring"
    ? `${tStr("Start Auto-pay of")} ${fmt(amount)}`
    : `${tStr("Proceed to Pay")} ${fmt(amount)}`;

  return (
    <div className="bg-white border border-rose-100 rounded-3xl p-5 sm:p-6 shadow-sm space-y-6 h-full flex flex-col">
      {/* Summary */}
      <section>
        <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 mb-3">
          <ClipboardList className="w-5 h-5 text-saffron" /> {tStr("Donation Summary")}
        </h2>
        <dl className="rounded-2xl border border-rose-100 divide-y divide-rose-100 text-sm overflow-hidden">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 px-4 py-2.5">
              <dt className="text-slate-500 shrink-0">{k}</dt>
              <dd className="font-semibold text-slate-800 text-right">{v}</dd>
            </div>
          ))}
          <div className="flex justify-between items-center gap-4 px-4 py-3 bg-rose-50">
            <dt className="font-bold text-saffron">{isPledge ? tStr("Amount Pledged") : tStr("Amount Payable")}</dt>
            <dd className="text-2xl font-black text-saffron tabular-nums">{amount > 0 ? fmt(amount) : "—"}</dd>
          </div>
        </dl>
      </section>

      {/* Payment */}
      {isPledge ? (
        <section className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-900">
          <CalendarClock className="w-5 h-5 shrink-0 text-amber-700" />
          <p>{tStr("No payment is taken today. We'll remind you before your pledge date so you can complete it.")}</p>
        </section>
      ) : (
        <section>
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 mb-3">
            <ShieldCheck className="w-5 h-5 text-saffron" /> {tStr("Pay Securely")}
          </h2>
          <div role="radiogroup" aria-label={tStr("Payment method")} className="space-y-2">
            {PAYMENT_METHODS.map((m) => {
              const active = paymentMethod === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border text-left transition-all ${active ? "border-saffron bg-rose-50/60" : "border-rose-100 hover:border-saffron/50"}`}
                >
                  <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${active ? "border-saffron" : "border-slate-300"}`}>
                    {active && <span className="w-2.5 h-2.5 rounded-full bg-saffron" />}
                  </span>
                  <span className="flex-1 text-sm font-semibold text-slate-800">{tStr(m.label)}</span>
                  <m.icon className={`w-5 h-5 ${active ? "text-saffron" : "text-slate-400"}`} />
                </button>
              );
            })}
          </div>
        </section>
      )}

      <div className="mt-auto">
        <button
          type="button"
          onClick={onPay}
          disabled={!canSubmit || isProcessing}
          className="w-full h-14 rounded-full bg-saffron text-white text-base font-bold flex items-center justify-center gap-2 shadow-lg shadow-saffron/25 hover:brightness-95 active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none"
        >
          {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-4 h-4" />}
          {isProcessing ? tStr("Processing…") : cta}
        </button>
        {group === "recurring" && amount > 0 && (
          <p className="text-center text-[11px] text-slate-500 mt-2">
            {fmt(amount)} {tStr("will be charged")} {tStr(frequencyLabel(frequency)).toLowerCase()}. {tStr("Cancel anytime.")}
          </p>
        )}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-[#0ca30c]" /> {tStr("SSL Encrypted")}</span>
          <span className="w-px h-4 bg-slate-200" aria-hidden />
          <span className="flex items-center gap-1.5"><Receipt className="w-4 h-4 text-saffron" /> {tStr("Instant e-receipt")}</span>
        </div>
      </div>
    </div>
  );
}
