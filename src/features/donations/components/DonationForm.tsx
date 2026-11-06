import { useTranslation } from "react-i18next";
import type { ReactNode } from "react";
import { Landmark, CalendarDays, Layers, IndianRupee, ShieldCheck, ChevronDown, Check, Info } from "lucide-react";
import { temples } from "@/data/temples";
import { CAUSES, FREQUENCIES, PRESET_AMOUNTS, frequencyGroup } from "../constants";

function Section({ icon: Icon, title, children }: { icon: typeof Landmark; title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 mb-3">
        <Icon className="w-5 h-5 text-saffron" /> {title}
      </h2>
      {children}
    </section>
  );
}

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export function DonationForm({
  temple, setTemple,
  cause, setCause,
  amount, setAmount,
  customAmount, setCustomAmount,
  frequency, setFrequency,
  pledgeDate, setPledgeDate,
}: any) {
  const { t: tStr } = useTranslation();
  const selectedTemple = temples.find((x) => x.slug === temple);
  const group = frequencyGroup(frequency);

  return (
    <div className="bg-white border border-rose-100 rounded-3xl p-5 sm:p-7 shadow-sm space-y-7">
      {/* Temple */}
      <Section icon={Landmark} title={tStr("Select Temple")}>
        <div className="relative">
          {selectedTemple?.image ? (
            <img src={selectedTemple.image} alt="" className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg object-cover pointer-events-none" />
          ) : (
            <span className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-rose-50 text-saffron flex items-center justify-center font-serif pointer-events-none">ॐ</span>
          )}
          <select
            aria-label={tStr("Select Temple")}
            value={temple}
            onChange={(e) => setTemple(e.target.value)}
            className="w-full h-14 pl-16 pr-10 bg-white border border-rose-100 rounded-2xl text-sm font-semibold text-slate-900 outline-none appearance-none cursor-pointer hover:border-saffron/50 focus:border-saffron focus:ring-4 focus:ring-saffron/10 transition-all"
          >
            {temples.map((x) => <option key={x.id} value={x.slug}>{tStr(x.name)}</option>)}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>
      </Section>

      {/* Frequency */}
      <Section icon={CalendarDays} title={tStr("Donation Frequency")}>
        <div role="radiogroup" aria-label={tStr("Donation Frequency")} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {FREQUENCIES.map((f) => {
            const active = group === f.id;
            return (
              <button
                key={f.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setFrequency(f.id === "recurring" ? (group === "recurring" ? frequency : "30days") : f.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl border text-left transition-all ${
                  active ? "bg-saffron border-saffron text-white shadow-md shadow-saffron/25" : "bg-white border-rose-100 text-slate-700 hover:border-saffron/50"
                }`}
              >
                <f.icon className={`w-5 h-5 shrink-0 ${active ? "text-white" : "text-saffron"}`} />
                <span className="min-w-0">
                  <span className="block text-sm font-bold leading-tight">{tStr(f.title)}</span>
                  {f.hint && <span className={`block text-[11px] leading-tight mt-0.5 ${active ? "text-white/85" : "text-slate-500"}`}>{tStr(f.hint)}</span>}
                </span>
              </button>
            );
          })}
        </div>

        {group === "recurring" && (
          <div className="mt-3 p-4 bg-rose-50/60 border border-rose-100 rounded-2xl animate-in fade-in slide-in-from-top-2 space-y-3">
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={tStr("Recurring Period")}>
              {[
                { v: "15days", l: "Every 15 days" },
                { v: "30days", l: "Every 30 days" },
                { v: "custom", l: "Custom" },
              ].map((o) => {
                const active = o.v === "custom" ? frequency.startsWith("custom") : frequency === o.v;
                return (
                  <button
                    key={o.v}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setFrequency(o.v === "custom" ? "custom-7" : o.v)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${active ? "bg-white border-saffron text-saffron" : "bg-white/60 border-rose-100 text-slate-600 hover:border-saffron/50"}`}
                  >
                    {tStr(o.l)}
                  </button>
                );
              })}
            </div>
            {frequency.startsWith("custom") && (
              <label className="flex items-center gap-3 bg-white px-3 py-2 rounded-xl border border-rose-100">
                <span className="text-sm text-slate-600 shrink-0">{tStr("Every")}</span>
                <input
                  type="number"
                  min={1}
                  value={frequency.replace("custom-", "").replace("custom", "")}
                  onChange={(e) => setFrequency(`custom-${e.target.value}`)}
                  className="w-full bg-transparent text-sm font-bold outline-none text-slate-900"
                  aria-label={tStr("Number of days")}
                />
                <span className="text-sm text-slate-600 shrink-0">{tStr("days")}</span>
              </label>
            )}
            <p className="flex items-start gap-2 text-xs text-slate-600">
              <Info className="w-4 h-4 text-saffron shrink-0 mt-0.5" />
              {tStr("The amount is auto-debited securely each period. You can cancel anytime.")}
            </p>
          </div>
        )}

        {group === "pledge" && (
          <div className="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl animate-in fade-in slide-in-from-top-2 space-y-3">
            <label className="block">
              <span className="block text-xs font-bold text-amber-800 mb-1.5">{tStr("I promise to donate by")}</span>
              <input
                type="date"
                value={pledgeDate}
                onChange={(e) => setPledgeDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2.5 text-sm font-semibold outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
              />
            </label>
            <p className="flex items-start gap-2 text-xs text-amber-800">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              {tStr("No money will be deducted today. We will gently remind you when your pledge date approaches.")}
            </p>
          </div>
        )}
      </Section>

      {/* Cause */}
      <Section icon={Layers} title={tStr("Select Cause")}>
        <div role="radiogroup" aria-label={tStr("Select Cause")} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {CAUSES.map((c) => {
            const active = cause === c.id;
            return (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setCause(c.id)}
                className={`relative flex flex-col items-center text-center px-3 py-4 rounded-2xl border transition-all ${
                  active ? "border-saffron bg-rose-50/70 ring-2 ring-saffron/15" : "border-rose-100 bg-white hover:border-saffron/50"
                }`}
              >
                {active && (
                  <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-saffron text-white flex items-center justify-center">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </span>
                )}
                <c.icon className="w-8 h-8 text-saffron mb-2" strokeWidth={1.6} />
                <span className="text-sm font-bold text-slate-900 leading-tight">{tStr(c.title)}</span>
                <span className="text-[11px] text-slate-500 mt-1 leading-snug">{tStr(c.desc)}</span>
              </button>
            );
          })}
        </div>
      </Section>

      {/* Amount */}
      <Section icon={IndianRupee} title={tStr("Select Amount")}>
        <div role="radiogroup" aria-label={tStr("Select Amount")} className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 mb-3">
          {PRESET_AMOUNTS.map((amt) => {
            const active = amount === amt && !customAmount;
            return (
              <button
                key={amt}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => { setAmount(amt); setCustomAmount(""); }}
                className={`h-12 rounded-xl border text-sm font-bold tabular-nums transition-all ${
                  active ? "bg-saffron border-saffron text-white shadow-md shadow-saffron/25" : "bg-white border-rose-100 text-slate-800 hover:border-saffron/50"
                }`}
              >
                {fmt(amt)}
              </button>
            );
          })}
        </div>
        <label className="relative block">
          <span className="sr-only">{tStr("Enter custom amount")}</span>
          <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="number"
            min={1}
            inputMode="numeric"
            value={customAmount}
            onChange={(e) => { setCustomAmount(e.target.value); setAmount(0); }}
            placeholder={tStr("Enter custom amount")}
            className={`w-full h-12 pl-10 pr-4 rounded-xl border bg-rose-50/40 text-sm font-semibold text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-400 focus:bg-white focus:border-saffron focus:ring-4 focus:ring-saffron/10 transition-all ${customAmount ? "border-saffron" : "border-rose-100"}`}
          />
        </label>
      </Section>

      <p className="flex items-center gap-2 text-xs text-slate-600 pt-1">
        <ShieldCheck className="w-4 h-4 text-saffron shrink-0" />
        {tStr("Your donation goes directly to the temple.")}
      </p>
    </div>
  );
}
